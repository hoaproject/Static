<?php

namespace {

from('Hoa')
-> import('Dispatcher.Kit')
-> import('File.Read')
-> import('Http.Response.~')
-> import('Xyl.~')
-> import('Xyl.Interpreter.Html.~')
-> import('File.Finder');

}

namespace Application\Controller {

class Gallery extends \Hoa\Dispatcher\Kit {

    public function construct ( ) {

        if(false === $this->router->isAsynchronous())
            $main = 'hoa://Application/View/Main.xyl';
        else
            $main = 'hoa://Application/View/Main.fragment.xyl';

        $xyl  = new \Hoa\Xyl(
            new \Hoa\File\Read($main),
            new \Hoa\Http\Response(),
            new \Hoa\Xyl\Interpreter\Html(),
            $this->router
        );
        $xyl->setTheme('');

        $this->view = $xyl;
        $this->data = $xyl->getData();

        return;
    }

    public function render ( ) {

        if(false === $this->router->isAsynchronous()) {

            $this->view->render();

            return;
        }

        $this->view->interprete();
        $this->view->render($this->view->getSnippet('async_main'));

        return;
    }

    public function IndexAction ( ) {

        $finder = new \Hoa\File\Finder();
        $finder->in('hoa://Application/Public/Gallery')
               ->name('#^[^\.]#')
               ->maxDepth(1);

        $list = array();

        foreach($finder as $file)
            $list[] = array('item' => $file->getBasename());

        $this->data->list = $list;
        $this->view->addOverlay('hoa://Application/View/Index.xyl');
        $this->render();

        return;
    }

    public function ListAction ( $gallery ) {

        $finder = new \Hoa\File\Finder();
        $finder->in('hoa://Application/Public/Gallery/' . $gallery)
               ->name('#_small\.jpg$#');

        $list = array();

        foreach($finder as $file)
            $list[] = array(
                'gallery' => $gallery,
                'link'    => $file->getBasename('_small.jpg'),
                'picture' => $file->getBasename('.jpg')
            );

        $this->data->list = $list;
        $this->view->addOverlay('hoa://Application/View/List.xyl');
        $this->view->render();

        return;
    }

    public function PictureAction ( $gallery, $picture ) {

        $finder = new \Hoa\File\Finder();
        $finder->in('hoa://Application/Public/Gallery/' . $gallery)
               ->name('#_small\.jpg$#');

        $previous = null;
        $current  = null;
        $next     = null;

        foreach($finder as $file) {

            $handle = strtolower($file->getBasename('_small.jpg'));

            if(null !== $current) {

                $next = $handle;
                break;
            }

            if($picture === $handle)
                $current = $handle;
            else
                $previous = $handle;
        }

        $this->data->gallery  = $gallery;
        $this->data->previous = $previous ?: $current;
        $this->data->current  = $current;
        $this->data->next     = $next ?: $current;
        $this->view->addOverlay('hoa://Application/View/Picture.xyl');
        $this->render();

        return;
    }

    public function VerbatimAction ( $gallery, $picture ) {

        $picture = file_get_contents(
            'hoa://Application/Public/Gallery/' .
            $gallery . '/' . $picture . '.jpg'
        );

        header('Content-Type: image/jpg');
        echo $picture;
    }
}

}
